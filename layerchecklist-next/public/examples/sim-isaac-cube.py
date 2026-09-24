"""Isaac Sim 5.1 Core API example: drop a cube, inspect its height.
Run in a compatible Isaac Sim environment, NOT an ordinary Python venv:
  ./python.sh /path/to/sim-isaac-cube.py
On Windows use python.bat. Requires the release's supported OS/GPU/driver.
This example is source-checked, not executed by the website or in the browser.
"""
from isaacsim import SimulationApp

simulation_app = SimulationApp({'headless': True})

# Isaac modules must be imported AFTER SimulationApp starts.
try:
    import numpy as np
    from isaacsim.core.api import World
    from isaacsim.core.api.objects import DynamicCuboid

    world = World(stage_units_in_meters=1., physics_dt=1./120., rendering_dt=1./60.)
    world.scene.add_default_ground_plane()
    cube = world.scene.add(DynamicCuboid(
        prim_path='/World/StudyCube', name='study_cube',
        position=np.array([0., 0., 1.]), size=.2, mass=1.,
        color=np.array([.1, .7, .9]),
    ))
    world.reset()
    for step in range(600):
        world.step(render=False)
        if step % 120 == 0:
            position, _ = cube.get_world_pose()
            print(f'step={step:03d}, cube center z={position[2]:.4f} m')
    print('The cube center should settle near half its side length, subject to contact settings.')
    print('There is no policy or reward in this example: it demonstrates the simulation layer.')
finally:
    simulation_app.close()
