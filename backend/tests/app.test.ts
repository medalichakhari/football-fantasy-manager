import { TransferService } from '../src/services/transferService';
import { AuthService } from '../src/services/authService';
import { TeamService } from '../src/services/teamService';
import { mockPrisma } from './setup';

describe('Football Fantasy Manager Tests', () => {
  beforeEach(() => {
    mockPrisma.userPlayer.count.mockResolvedValue(16);
  });
  // Test 1 : Create transfer listing
  test('after checking for existing user player, we can create a transfer listing', async () => {
    const transferService = new TransferService();

    mockPrisma.userPlayer.findFirst.mockResolvedValue({
      id: 'up1',
      userId: 'user1',
      playerId: 'player1',
      price: 800000,
      player: { name: 'Messi' },
    });

    mockPrisma.transferListing.findFirst.mockResolvedValue(null);
    mockPrisma.transferListing.create.mockResolvedValue({
      id: 'listing1',
      sellerId: 'user1',
      playerId: 'player1',
      price: 900000,
      isActive: true,
    });

    const result = await transferService.createListing('user1', {
      playerId: 'player1',
      price: 900000,
    });

    expect(result.price).toBe(900000);
    expect(result.isActive).toBe(true);
  });

  // Test 2: Get market listings with pagination
  test('fetching market listings with pagination', async () => {
    const transferService = new TransferService();

    const mockListings = [
      { id: '1', price: 1000000, player: { name: 'Ronaldo' } },
      { id: '2', price: 800000, player: { name: 'Benzema' } },
    ];

    mockPrisma.transferListing.findMany.mockResolvedValue(mockListings);
    mockPrisma.transferListing.count.mockResolvedValue(25);

    const result = await transferService.getMarketListings({
      page: 2,
      limit: 10,
    });

    expect(result.listings).toHaveLength(2);
    expect(result.totalCount).toBe(25);
    expect(result.page).toBe(2);
  });

  // Test 3: Authentication
  test('authenticate', async () => {
    const authService = new AuthService();

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user1',
      email: 'test@test.com',
      password: '$2b$12$hashedpassword',
      budget: 5000000,
      teamGenerationStatus: 'COMPLETED',
    });

    const bcrypt = require('bcrypt');
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const result = await authService.authenticate({
      email: 'test@test.com',
      password: 'mypassword',
    });

    expect(result.isNewUser).toBe(false);
    expect(result.user.email).toBe('test@test.com');
    expect(result.token).toBeDefined();
  });

  // Test 4: New user
  test('registers a new user', async () => {
    const authService = new AuthService();

    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'newuser1',
      email: 'new@test.com',
      password: '$2b$12$hashedpassword',
      budget: 5000000,
      teamGenerationStatus: 'PENDING',
    });

    const result = await authService.authenticate({
      email: 'new@test.com',
      password: 'newpassword',
    });

    expect(result.isNewUser).toBe(true);
    expect(result.user.budget).toBe(5000000);
    expect(result.user.teamGenerationStatus).toBe('PENDING');
  });

  // Test 5: Get user team
  test('get user team', async () => {
    const teamService = new TeamService();

    const mockPlayers = [
      { id: '1', playerId: 'p1', player: { position: 'GK', name: 'Casillas' } },
      { id: '2', playerId: 'p2', player: { position: 'DEF', name: 'Ramos' } },
      { id: '3', playerId: 'p3', player: { position: 'MID', name: 'Modric' } },
      { id: '4', playerId: 'p4', player: { position: 'ATT', name: 'Mbappe' } },
    ];

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user1',
      budget: 4000000,
    });

    mockPrisma.userPlayer.findMany.mockResolvedValue(mockPlayers);

    const result = await teamService.getUserTeam('user1');

    expect(result.players).toHaveLength(4);
    expect(result.budget).toBe(4000000);
    expect(result.teamStats.totalPlayers).toBe(4);
  });

  // Test 6: Buy a new player
  test('buy a new player', async () => {
    const transferService = new TransferService();

    const mockListing = {
      id: 'listing1',
      sellerId: 'seller1',
      playerId: 'player1',
      price: 1000000,
      isActive: true,
      player: { name: 'Neymar', price: 1000000 },
      seller: { budget: 3000000, email: 'seller@test.com' },
    };

    const mockBuyer = {
      id: 'buyer1',
      budget: 5000000,
    };

    mockPrisma.transferListing.findUnique.mockResolvedValue(mockListing);
    mockPrisma.user.findUnique.mockResolvedValue(mockBuyer);

    mockPrisma.$transaction.mockImplementation(async fn => {
      return fn(mockPrisma);
    });

    const result = await transferService.buyPlayer('buyer1', {
      transferListingId: 'listing1',
    });

    expect(result.paidPrice).toBe(950000);
    expect(result.originalPrice).toBe(1000000);
    expect(result.discountApplied).toBe(50000);
  });

  // Test 7: Not being able to buy your own player
  test('not being able to buy your own player', async () => {
    const transferService = new TransferService();

    const mockListing = {
      id: 'listing1',
      sellerId: 'user1',
      playerId: 'player1',
      price: 1000000,
      isActive: true,
    };

    mockPrisma.transferListing.findUnique.mockResolvedValue(mockListing);
    mockPrisma.$transaction.mockImplementation(async fn => {
      return fn(mockPrisma);
    });

    await expect(
      transferService.buyPlayer('user1', {
        transferListingId: 'listing1',
      })
    ).rejects.toThrow('Cannot buy your own player');
  });

  // Test 8: Remove player frrom transfer listing
  test('Remove player from transfer listing', async () => {
    const transferService = new TransferService();

    const mockListing = {
      id: 'listing1',
      sellerId: 'user1',
      playerId: 'player1',
      isActive: true,
    };

    mockPrisma.transferListing.findFirst.mockResolvedValue(mockListing);
    mockPrisma.transferListing.update.mockResolvedValue({
      ...mockListing,
      isActive: false,
    });

    await transferService.removeListing('user1', 'listing1');

    expect(mockPrisma.transferListing.update).toHaveBeenCalledWith({
      where: { id: 'listing1' },
      data: { isActive: false },
    });
  });
});
