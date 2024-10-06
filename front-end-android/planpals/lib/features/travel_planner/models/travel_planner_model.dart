import 'accommodation_model.dart';
import 'activity_model.dart';
import 'flight_model.dart';

class TravelPlanner {
  final String travelPlanId;
  final String destination;
  final String plannerName;
  final DateTime startDate;
  final DateTime endDate;
  final DateTime createdAt;
  final List<Flight> flights;
  final List<Accommodation> accommodations;
  final List<Activity> activities;

  TravelPlanner({
    required this.travelPlanId,
    required this.destination,
    required this.plannerName,
    required this.startDate,
    required this.endDate,
    required this.createdAt,
    required this.flights,
    required this.accommodations,
    required this.activities,
  });

  // Convert a TravelPlanner object into a Map.
  Map<String, dynamic> toJson() {
    return {
      'id': travelPlanId,
      'destination': destination,
      'plannerName': plannerName,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'flights': flights.map((flight) => flight.toJson()).toList(),
      'accommodations': accommodations.map((acc) => acc.toJson()).toList(),
      'activities': activities.map((activity) => activity.toJson()).toList(),
    };
  }

  // Create a TravelPlanner object from a Map.
  factory TravelPlanner.fromJson(Map<String, dynamic> json) {
    return TravelPlanner(
      travelPlanId: json['travelPlanId'],
      destination: json['destination'],
      plannerName: json['plannerName'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      createdAt: DateTime.parse(json['createdAt']),
      flights: (json['flights'] as List)
          .map((flight) => Flight.fromJson(flight))
          .toList(),
      accommodations: (json['accommodations'] as List)
          .map((acc) => Accommodation.fromJson(acc))
          .toList(),
      activities: (json['activities'] as List)
          .map((activity) => Activity.fromJson(activity))
          .toList(),
    );
  }
}
