import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class Destination {
  final String createdBy; // ID of the user who created the destination
  final String destinationId; // Unique identifier for the destination
  final String plannerId; // ID of the associated planner
  String name; // Name of the destination
  DateTime startDate; // Start date of the destination
  DateTime endDate; // End date of the destination
  final List<String> activities; // List of associated activity IDs
  final List<String> accommodations; // List of associated accommodation IDs
  List<Activity> activityList = [];
  List<Accommodation> accommodationList = [];
  Vote vote;

  // Constructor
  Destination({
    required this.createdBy,
    required this.destinationId,
    required this.plannerId,
    required this.name,
    required this.startDate,
    required this.endDate,
    required this.activities,
    required this.accommodations,
    Vote? vote, // make this parameter nullable
  }) : vote = vote ?? Vote(createdBy: createdBy, id: '', objectId: destinationId, type: 'Destination', upVotes: [], downVotes: []);

  // Factory method to create a Destination from JSON
  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      createdBy: json['createdBy'] ?? '',
      destinationId: json['_id'] ?? '',
      plannerId: json['plannerId'] ?? '',
      name: json['name'] ?? '',
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      activities: List<String>.from(json['activities'] ?? []),
      accommodations: List<String>.from(json['accommodations'] ?? []),
    );
  }

  // Method to convert a Destination to JSON
  Map<String, dynamic> toJson() {
    return {
      'createdBy': createdBy,
      'destinationId': destinationId,
      'plannerId': plannerId,
      'name': name,
      'startDate':
          DateTimeToIso.formatToUtcIso(startDate), // Convert DateTime to String
      'endDate':
          DateTimeToIso.formatToUtcIso(endDate), // Convert DateTime to String
      'activities': activities,
      'accommodations': accommodations,
    };
  }

  @override
  String toString() {
    return 'Destination: $name\n'
        'ID: $destinationId\n'
        'Planner ID: $plannerId\n'
        'Start Date: ${startDate.toLocal()}\n'
        'End Date: ${endDate.toLocal()}\n'
        'Activities: ${activities.isNotEmpty ? activities.join(', ') : 'None'}\n'
        'Accommodations: ${accommodations.isNotEmpty ? accommodations.join(', ') : 'None'}';
  }

  void update(Destination updatedDestination) {
    name = updatedDestination.name;
    startDate = updatedDestination.startDate;
    endDate = updatedDestination.endDate;
  }

  void updateAnAccommodation(Accommodation updatedAccommodation) {
    accommodationList
        .firstWhere((accommodation) =>
            accommodation.accommodationId == updatedAccommodation.accommodationId)
        .update(updatedAccommodation);
  }
}
