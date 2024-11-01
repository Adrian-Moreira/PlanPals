import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class Activity {
  final String activityId;
  final String destinationId;
  final String createdBy;
  String name;
  String location;
  DateTime startDate; // startDate as String
  double duration; // Duration of the activity in minutes
  Vote vote;

  Activity({
    required this.activityId,
    required this.createdBy,
    required this.destinationId,
    required this.name,
    required this.startDate,
    required this.duration,
    required this.location,
    Vote? vote, // make this parameter nullable
  }) : vote = vote ?? Vote(createdBy: createdBy, id: '', objectId: activityId, type: 'Activity', upVotes: [], downVotes: []);

  // Factory method to create Activity from JSON
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      createdBy: json['createdBy'],
      activityId: json['_id'],
      destinationId: json['destinationId'],
      name: json['name'],
      startDate: DateTime.parse(json['startDate']),
      duration: json['duration'].toDouble(),
      location: json['location'],
    );
  }

  // Method to convert Activity to JSON
  Map<String, dynamic> toJson() {
    return {
      'createdBy': createdBy,
      'activityId': activityId,
      'destinationId': destinationId,
      'name': name,
      'startDate': DateTimeToIso.formatToUtcIso(startDate),
      'duration': duration,
      'location': location,
    };
  }

  @override
  String toString() {
    return 'Activity {\n'
        '  activityId: $activityId,\n'
        '  createdById: $createdBy,\n'
        '  destinationId: $destinationId,\n'
        '  name: $name,\n'
        '  startDate: $startDate,\n'
        '  duration: $duration,\n'
        '  location: $location,\n'
        '}';
  }

  void update(Activity updatedActivity) {
    name = updatedActivity.name;
    startDate = updatedActivity.startDate;
    duration = updatedActivity.duration;
    location = updatedActivity.location;
  }
}
