import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';

class MockDataBase {
  static List<Planner> planners = [
    Planner(
      plannerId: 'planner001',
      createdBy: 'user123',
      startDate: DateTime.parse('2023-10-01'),
      endDate: DateTime.parse('2023-10-10'),
      name: 'Trip to Spain',
      description: 'Exploring Barcelona and Madrid',
      roUsers: ['user456'], // Read-only users
      rwUsers: ['user789'], // Read-write users
      destinations: ['dest001', 'dest002'],
      transportations: ['trans001', 'trans002'],
    ),

    // Instance 2
    Planner(
      plannerId: 'planner002',
      createdBy: 'user456',
      startDate: DateTime.parse('2023-11-01'),
      endDate: DateTime.parse('2023-11-15'),
      name: 'Weekend Getaway',
      description: 'A quick trip to the mountains',
      roUsers: ['user123', 'user789'], // Read-only users
      rwUsers: [], // No read-write users
      destinations: ['dest003'],
      transportations: ['trans003'],
    ),

    // Instance 3
    Planner(
      plannerId: 'planner003',
      createdBy: 'user789',
      startDate: DateTime.parse('2023-12-20'),
      endDate: DateTime.parse('2023-12-30'),
      name: 'Holiday Adventure',
      description: 'Celebrating the holidays with family',
      roUsers: [], // No read-only users
      rwUsers: ['user123', 'user456'], // Read-write users
      destinations: ['dest004', 'dest005'],
      transportations: ['trans004', 'trans005', 'trans006'],
    ),
  ];

  static List<Transport> transports = [
    

  ];

  static List<Destination> destinations = [
    Destination(
    destinationId: 'dest001',
    plannerId: 'planner001',
    name: 'Madrid',
    startDate: DateTime.parse('2023-10-01'),
    endDate: DateTime.parse('2023-10-05'),
    activities: ['activity001', 'activity002'],
    accommodations: ['accom001', 'accom002'],
  ),

  // Instance 2
 Destination(
    destinationId: 'dest002',
    plannerId: 'planner002',
    name: 'Paris',
    startDate: DateTime.parse('2023-11-10'),
    endDate: DateTime.parse('2023-11-15'),
    activities: ['activity003', 'activity004'],
    accommodations: ['accom003', 'accom004'],
  ),

  // Instance 3
Destination(
    destinationId: 'dest003',
    plannerId: 'planner003',
    name: 'Tokyo',
    startDate: DateTime.parse('2024-01-20'),
    endDate: DateTime.parse('2024-01-25'),
    activities: ['activity005'],
    accommodations: ['accom005'],
  ),
  ];

  static User user = User(id: '123', userName: 'bobby', preferredName: 'bob');
}
