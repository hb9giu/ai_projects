import pygame
import torch
import sys

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
NUM_PARTICLES = 1000
MOUSE_FOLLOW_RADIUS = 200.0
MAX_SPEED = 5.0  # Maximum speed for normalization

# Colors
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Pygame setup
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Particle System")

# PyTorch device selection
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Particle initialization
positions = (torch.rand(NUM_PARTICLES, 2) * torch.tensor([SCREEN_WIDTH, SCREEN_HEIGHT])).to(device)
velocities = (torch.randn(NUM_PARTICLES, 2)).to(device) / 10.0

# Function to update colors based on speed
def update_colors(velocities):
    # Kiszámoljuk a sebességet (hosszt) minden részecskére
    speeds = torch.norm(velocities, dim=1)
    max_speed = speeds.max() if speeds.max() > 0 else 1.0
    normalized_speeds = (speeds / max_speed).clamp(0, 1)

    # Definiáljuk a bázis színeket (ha nincsenek meg, itt létrehozzuk őket)
    # hot = pirosas/sárgás, cold = kékes
    hot = torch.tensor([255, 100, 0], device=device, dtype=torch.float32)
    cold = torch.tensor([0, 100, 255], device=device, dtype=torch.float32)

    # Itt történik a varázslat: (N, 1) * (1, 3) = (N, 3)
    # A normalized_speeds-et (N,) -> (N, 1) alakra hozzuk az unsqueeze(1)-gyel
    new_colors = (hot.view(1, 3) * normalized_speeds.unsqueeze(1) + 
                  cold.view(1, 3) * (1 - normalized_speeds.unsqueeze(1)))
    
    return new_colors.to(torch.uint8)

# Function to draw particles on the screen
def draw_particles(positions, colors):
    for pos, color in zip(positions.tolist(), colors.tolist()):
        pygame.draw.circle(screen, tuple(color), (int(pos[0]), int(pos[1])), 2)

# Main loop
running = True
following_mouse = False

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            following_mouse = not following_mouse

    screen.fill(WHITE)

    if following_mouse:
        mouse_x, mouse_y = torch.tensor(pygame.mouse.get_pos(), dtype=torch.float32).to(device)
        mouse_pos = mouse_x, mouse_y

        # Calculate vector from each particle to the mouse
        delta_positions = torch.stack([mouse_pos[0] - positions[:, 0], mouse_pos[1] - positions[:, 1]]).t()

        # Calculate distance to mouse for each particle
        distances = torch.norm(delta_positions, dim=1)

        # Normalize direction vectors and scale by inverse distance squared
        directions = delta_positions / (distances.unsqueeze(1) + 1e-8)
        influences = (MOUSE_FOLLOW_RADIUS - distances).clamp(min=0) ** 2

        # Calculate new velocities based on mouse influence
        forces = directions * influences.unsqueeze(1)
        velocities += forces

    # Update positions based on velocity
    positions += velocities

    # Wrap around particles that go off-screen
    positions[:, 0] %= SCREEN_WIDTH
    positions[:, 1] %= SCREEN_HEIGHT

    colors = update_colors(velocities)  # Update colors based on current speed

    draw_particles(positions, colors)

    pygame.display.flip()
    pygame.time.delay(30)  # ~33.3 FPS

pygame.quit()
