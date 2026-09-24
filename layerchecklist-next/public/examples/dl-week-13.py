"""Week 13: DQN with replay and correct terminal/truncation semantics.
python -m pip install torch
python dl-week-13.py [--smoke] [--seed 7]
Seven-state line world: move left/right, goal at 6, external cutoff at 20.
"""
import argparse
import copy
import random
from collections import deque
import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)
STATES, LIMIT, GAMMA = 7, 20, .95


def transition(state, action, elapsed):
    next_state = max(0, min(STATES-1, state + (1 if action == 1 else -1)))
    terminated = next_state == STATES-1
    truncated = elapsed >= LIMIT and not terminated
    reward = 1. if terminated else -.02
    return next_state, reward, terminated, truncated


def encode(states):
    return F.one_hot(torch.as_tensor(states, dtype=torch.long), STATES).float()


def network():
    return nn.Sequential(nn.Linear(STATES, 32), nn.ReLU(), nn.Linear(32, 2))


@torch.no_grad()
def evaluate(model, random_policy=False):
    rng = random.Random(9876)
    returns, successes, lengths = [], [], []
    # All possible nonterminal starts, repeated for random-policy variability.
    for start in list(range(STATES-1))*20:
        state, total, success = start, 0., False
        for step in range(1, LIMIT+1):
            action = rng.randrange(2) if random_policy else int(model(encode([state])).argmax(1))
            state, reward, terminal, truncated = transition(state, action, step)
            total += reward
            if terminal or truncated:
                success = terminal
                break
        returns.append(total)
        successes.append(success)
        lengths.append(step)
    n = len(returns)
    return sum(returns)/n, sum(successes)/n, sum(lengths)/n


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    p.add_argument('--seed', type=int, default=7)
    args = p.parse_args()
    torch.manual_seed(args.seed)
    rng = random.Random(args.seed)
    print('PyTorch', torch.__version__, 'seed', args.seed)
    online, target = network(), network()
    target.load_state_dict(copy.deepcopy(online.state_dict()))
    target.eval()
    for parameter in target.parameters():
        parameter.requires_grad_(False)
    opt = torch.optim.Adam(online.parameters(), lr=.003)
    replay = deque(maxlen=4000)
    updates = env_steps = 0
    loss_value = float('nan')
    for episode in range(12 if args.smoke else 250):
        state = rng.randrange(STATES-1)
        epsilon = max(.08, 1.-episode/170)
        for elapsed in range(1, LIMIT+1):
            if rng.random() < epsilon:
                action = rng.randrange(2)
            else:
                with torch.no_grad():
                    action = int(online(encode([state])).argmax(1))
            next_state, reward, terminal, truncated = transition(state, action, elapsed)
            # Store actual next_state BEFORE resetting. Only terminal masks bootstrap.
            replay.append((state, action, reward, next_state, terminal, truncated))
            state = next_state
            env_steps += 1
            if len(replay) >= 32:
                batch = rng.sample(list(replay), 32)
                states, actions, rewards, next_states, terminals, _ = zip(*batch)
                rewards = torch.tensor(rewards)
                terminal_mask = torch.tensor(terminals, dtype=torch.bool)
                with torch.no_grad():
                    y = rewards + GAMMA*(~terminal_mask).float()*target(encode(next_states)).max(1).values
                assert torch.equal(y[terminal_mask], rewards[terminal_mask])
                selected = online(encode(states)).gather(1, torch.tensor(actions)[:, None]).squeeze(1)
                loss = F.smooth_l1_loss(selected, y)
                assert torch.isfinite(loss)
                opt.zero_grad()
                loss.backward()
                nn.utils.clip_grad_norm_(online.parameters(), 5.)
                opt.step()
                updates += 1
                loss_value = loss.item()
                if updates % 50 == 0:
                    target.load_state_dict(online.state_dict())
            if terminal or truncated:
                break
    online.eval()
    for name, random_policy in [('Random', True), ('DQN greedy', False)]:
        ret, success, length = evaluate(online, random_policy)
        print(f'{name}: mean undiscounted return={ret:.3f}; success={success:.3f}; mean length={length:.2f}')
    path, state = [0], 0
    with torch.no_grad():
        for step in range(1, LIMIT+1):
            action = int(online(encode([state])).argmax(1))
            state, _, terminal, truncated = transition(state, action, step)
            path.append(state)
            if terminal or truncated:
                break
    print('Greedy path from 0:', path)
    print(f'Environment steps={env_steps}; gradient updates={updates}; final TD loss={loss_value:.5f}')
    print('Evaluation covers this fixed toy world, not unseen dynamics. Repeat independent --seed values.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
