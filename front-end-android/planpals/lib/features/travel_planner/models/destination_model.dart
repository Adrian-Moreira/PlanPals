class Destination {
  final String destinationId; // Unique identifier for the destination
  final String plannerId; // ID of the associated planner
  final String name; // Name of the destination
  final DateTime startDate; // Start date of the destination
  final DateTime endDate; // End date of the destination
  final List<String> activities; // List of associated activity IDs
  final List<String> accommodations; // List of associated accommodation IDs

  // Constructor
  Destination({
    required this.destinationId,
    required this.plannerId,
    required this.name,
    required this.startDate,
    required this.endDate,
    required this.activities,
    required this.accommodations,
  });

  // Factory method to create a Destination from JSON
  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      destinationId: json['destinationId'],
      plannerId: json['plannerId'],
      name: json['name'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      activities: List<String>.from(json['activities']),
      accommodations: List<String>.from(json['accommodations']),
    );
  }

  // Method to convert a Destination to JSON
  Map<String, dynamic> toJson() {
    return {
      'destinationId': destinationId,
      'plannerId': plannerId,
      'name': name,
      'startDate': startDate.toIso8601String(), // Convert DateTime to String
      'endDate': endDate.toIso8601String(), // Convert DateTime to String
      'activities': activities,
      'accommodations': accommodations,
    };
  }
}
