"""A force-controlled slider in MuJoCo. No neural network and no viewer.
python -m pip install mujoco
python sim-mujoco-servo.py
Creates sim-mujoco-servo.csv in the current folder.
"""
import csv
import math
import mujoco

XML = """
<mujoco model="one_axis_servo">
  <option timestep="0.0025" gravity="0 0 -9.81"/>
  <worldbody>
    <geom type="plane" size="2 2 .1"/>
    <body name="carriage" pos="0 0 .2">
      <joint name="rail" type="slide" axis="1 0 0" damping=".4"/>
      <geom type="box" size=".1 .1 .1" mass="1"/>
    </body>
  </worldbody>
  <actuator><motor joint="rail" gear="1" ctrllimited="true" ctrlrange="-2 2"/></actuator>
</mujoco>
"""


def main():
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)
    data.qpos[0] = -.5
    mujoco.mj_forward(model, data)
    target, decimation, force = .5, 4, 0.
    rows = []
    for step in range(2400):  # six simulated seconds at 400 Hz
        if step % decimation == 0:  # controller at 100 Hz
            error = target-data.qpos[0]
            force = max(-2., min(2., 8.*error-4.*data.qvel[0]))
        data.ctrl[0] = force
        mujoco.mj_step(model, data)
        assert math.isfinite(data.qpos[0]) and math.isfinite(data.qvel[0])
        rows.append((data.time, data.qpos[0], data.qvel[0], force))
    with open('sim-mujoco-servo.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['time_s', 'position_m', 'velocity_m_s', 'force_N'])
        writer.writerows(rows)
    print('MuJoCo', mujoco.__version__)
    print('Physics: 400 Hz; controller: 100 Hz; action is a force in newtons.')
    print(f'Final position={data.qpos[0]:.5f} m; target={target}; absolute error={abs(target-data.qpos[0]):.5f} m')
    print('Saved sim-mujoco-servo.csv. This rail-constrained example tests control, not contact fidelity.')


if __name__ == '__main__':
    main()
