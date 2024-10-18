class Transport {
  final String createdBy;
  final String id;           // Unique identifier for the travel item
  final String plannerId;   // Identifier for the associated planner
  final String type;        // Type of travel (e.g., Flight)
  final String details;     // Details of the travel item
  final String vehicleId;   // Vehicle identifier (e.g., flight number)
  final DateTime departureTime; // Departure time
  final DateTime arrivalTime;   // Arrival time

  Transport({
    required this.createdBy,
    required this.id,
    required this.plannerId,
    required this.type,
    required this.details,
    required this.vehicleId,
    required this.departureTime,
    required this.arrivalTime,
  });

  // Factory method to create a Transport from JSON
  factory Transport.fromJson(Map<String, dynamic> json) {
    return Transport(
      createdBy: json['createdBy'] ?? '',
      id: json['_id'] ?? '',
      plannerId: json['plannerId'] ?? '',
      type: json['type'] ?? '',
      details: json['details'] ?? '',
      vehicleId: json['vehicleId'] ?? '',
      departureTime: DateTime.parse(json['departureTime']),
      arrivalTime: DateTime.parse(json['arrivalTime']),
    );
  }

  // Method to convert a Transport to JSON
  Map<String, dynamic> toJson() {
    return {
      'createdBy': createdBy,
      '_id': id,
      'plannerId': plannerId,
      'type': type,
      'details': details,
      'vehicleId': vehicleId,
      'departureTime': departureTime.toIso8601String(),
      'arrivalTime': arrivalTime.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'TravelItem(id: $id, plannerId: $plannerId, type: $type, '
           'details: $details, vehicleId: $vehicleId, '
           'departureTime: ${departureTime.toIso8601String()}, '
           'arrivalTime: ${arrivalTime.toIso8601String()}),'
           'createdBy: $createdBy';
  }
}
