class Transport {
  final String transportationId;  // Unique identifier for the transportation
  final String plannerId;          // ID of the associated planner
  final String type;               // Type of transportation (e.g., Flight)
  final String details;            // Details about the transportation
  final DateTime departureTime;    // Departure time as DateTime
  final DateTime arrivalTime;      // Arrival time as DateTime

  // Constructor
  Transport({
    required this.transportationId,
    required this.plannerId,
    required this.type,
    required this.details,
    required this.departureTime,
    required this.arrivalTime,
  });

  // Factory method to create a Transport instance from JSON
  factory Transport.fromJson(Map<String, dynamic> json) {
    return Transport(
      transportationId: json['transportationId'],
      plannerId: json['plannerId'],
      type: json['type'],
      details: json['details'],
      departureTime: DateTime.parse(json['departureTime']),
      arrivalTime: DateTime.parse(json['arrivalTime']),
    );
  }

  // Method to convert Transport instance to JSON
  Map<String, dynamic> toJson() {
    return {
      'transportationId': transportationId,
      'plannerId': plannerId,
      'type': type,
      'details': details,
      'departureTime': departureTime.toIso8601String(),
      'arrivalTime': arrivalTime.toIso8601String(),
    };
  }
}
