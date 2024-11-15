import 'package:planpals/features/vote/vote_model.dart';

class Transport {
  final String createdBy;
  final String id; // Unique identifier for the travel item
  final String plannerId; // Identifier for the associated planner
  String type; // Type of travel (e.g., Flight)
  String details; // Details of the travel item
  final String vehicleId; // Vehicle identifier (e.g., flight number)
  DateTime departureTime; // Departure time
  DateTime arrivalTime; // Arrival time
  Vote vote;

  Transport({
    required this.createdBy,
    required this.id,
    required this.plannerId,
    required this.type,
    required this.details,
    required this.vehicleId,
    required this.departureTime,
    required this.arrivalTime,
    Vote? vote, // make this parameter nullable
  }) : vote = vote ?? Vote(createdBy: createdBy, id: '', objectId: id, type: 'Transport', upVotes: [], downVotes: []);

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
    return 'Transport(id: $id, plannerId: $plannerId, type: $type, '
        'details: $details, vehicleId: $vehicleId, '
        'departureTime: ${departureTime.toIso8601String()}, '
        'arrivalTime: ${arrivalTime.toIso8601String()}),'
        'createdBy: $createdBy';
  }

  void update(Transport updatedTransport) {
    type = updatedTransport.type;
    details = updatedTransport.details;
    departureTime = updatedTransport.departureTime;
    arrivalTime = updatedTransport.arrivalTime;
  }
}
