class Planner {
  final String plannerId;
  final String createdBy;
  final DateTime startDate;
  final DateTime endDate;
  final String name;
  final String description;
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
      plannerId: json['plannerId'],
      createdBy: json['createdBy'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      name: json['name'],
      description: json['description'],
      roUsers: List<String>.from(json['roUsers']),
      rwUsers: List<String>.from(json['rwUsers']),
      destinations: List<String>.from(json['destinations']),
      transportations: List<String>.from(json['transportations']),
    );
  }

  // Convert a Planner object to JSON
  Map<String, dynamic> toJson() {
    return {
      'plannerId': plannerId,
      'createdBy': createdBy,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'name': name,
      'description': description,
      'roUsers': roUsers,
      'rwUsers': rwUsers,
      'destinations': destinations,
      'transportations': transportations,
    };
  }
}
