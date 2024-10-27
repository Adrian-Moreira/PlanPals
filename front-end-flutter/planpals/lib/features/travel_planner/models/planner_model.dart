import 'package:planpals/shared/utils/date_utils.dart';

class Planner {
  final String plannerId;
  final String createdBy;
  DateTime startDate;
  DateTime endDate;
  String name;
  String description;
  final List<String> roUsers;
  final List<String> rwUsers;
  final List<String> destinations;
  final List<String> transportations;

  Planner({
    required this.plannerId,
    required this.createdBy,
    required this.startDate,
    required this.endDate,
    required this.name,
    required this.description,
    required this.roUsers,
    required this.rwUsers,
    required this.destinations,
    required this.transportations,
  });

  // Factory constructor to create a Planner from JSON
  factory Planner.fromJson(Map<String, dynamic> json) {
    return Planner(
      plannerId: json['_id'] ?? '', // Map '_id' to 'plannerId'
      createdBy: json['createdBy'] ?? '',
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      roUsers: List<String>.from(json['roUsers'] ?? []),
      rwUsers: List<String>.from(json['rwUsers'] ?? []),
      destinations: List<String>.from(json['destinations'] ?? []),
      transportations: List<String>.from(json['transportations'] ?? []),
    );
  }

  // Method to convert a Planner to JSON
  Map<String, dynamic> toJson() {
    return {
      'createdBy': createdBy,
      'startDate': DateTimeToIso.formatToUtcIso(startDate),
      'endDate': DateTimeToIso.formatToUtcIso(endDate),
      'name': name,
      'description': description,
      'roUsers': roUsers,
      'rwUsers': rwUsers,
      'destinations': destinations,
      'transportations': transportations,
    };
  }

  @override
  String toString() {
    return 'Planner { '
        'plannerId: $plannerId, '
        'createdBy: $createdBy, '
        'startDate: $startDate, '
        'endDate: $endDate, '
        'name: $name, '
        'description: $description, '
        'roUsers: $roUsers, '
        'rwUsers: $rwUsers, '
        'destinations: $destinations, '
        'transportations: $transportations '
        '}';
  }
<<<<<<< HEAD:front-end-android/planpals/lib/features/travel_planner/models/planner_model.dart

  void update(Planner updatedPlanner) {
    startDate = updatedPlanner.startDate;
    endDate = updatedPlanner.endDate;
    name = updatedPlanner.name;
    description = updatedPlanner.description;
  }
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/models/planner_model.dart
}
