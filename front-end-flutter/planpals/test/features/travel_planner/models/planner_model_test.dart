import 'package:flutter_test/flutter_test.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';

void main() {
  group('Planner Model Tests', () {
    test('Planner fromJson() should parse data correctly', () {
      // Arrange: Create a sample JSON object
      final json = {
        '_id': '12345',
        'createdBy': 'user1',
        'startDate': '2024-01-01T12:00:00.000Z',
        'endDate': '2024-01-10T12:00:00.000Z',
        'name': 'Trip to Bali',
        'description': 'A relaxing vacation in Bali.',
        'roUsers': ['user2', 'user3'],
        'rwUsers': ['user1'],
        'destinations': ['Bali', 'Ubud'],
        'transportations': ['Plane', 'Car']
      };

      // Act: Convert JSON to Planner object
      final planner = Planner.fromJson(json);

      // Assert: Verify that fields are parsed correctly
      expect(planner.plannerId, '12345');
      expect(planner.createdBy, 'user1');
      expect(planner.startDate, DateTime.parse('2024-01-01T12:00:00.000Z'));
      expect(planner.endDate, DateTime.parse('2024-01-10T12:00:00.000Z'));
      expect(planner.name, 'Trip to Bali');
      expect(planner.description, 'A relaxing vacation in Bali.');
      expect(planner.roUsers, ['user2', 'user3']);
      expect(planner.rwUsers, ['user1']);
      expect(planner.destinations, ['Bali', 'Ubud']);
      expect(planner.transportations, ['Plane', 'Car']);
    });

    test('Planner toJson() should convert data to JSON correctly', () {
      // Arrange: Create a Planner object
      final planner = Planner(
        plannerId: '12345',
        createdBy: 'user1',
        startDate: DateTime.parse('2024-01-01T12:00:00.000Z'),
        endDate: DateTime.parse('2024-01-10T12:00:00.000Z'),
        name: 'Trip to Bali',
        description: 'A relaxing vacation in Bali.',
        roUsers: ['user2', 'user3'],
        rwUsers: ['user1'],
        destinations: ['Bali', 'Ubud'],
        transportations: ['Plane', 'Car'],
      );

      // Act: Convert Planner object to JSON
      final json = planner.toJson();

      // Assert: Verify that fields are converted to JSON correctly
      expect(json['_id'], '12345');
      expect(json['createdBy'], 'user1');
      expect(json['startDate'], '2024-01-01T12:00:00.000Z');
      expect(json['endDate'], '2024-01-10T12:00:00.000Z');
      expect(json['name'], 'Trip to Bali');
      expect(json['description'], 'A relaxing vacation in Bali.');
      expect(json['roUsers'], ['user2', 'user3']);
      expect(json['rwUsers'], ['user1']);
      expect(json['destinations'], ['Bali', 'Ubud']);
      expect(json['transportations'], ['Plane', 'Car']);
      expect(json['invites'], []);
    });
  });
}
