import 'package:planpals/shared/utils/date_utils.dart';

class Activity {
  final String? activityId;
  final String destinationId;
  final String createdBy;
  String name;
  String location;
  DateTime startDate; // startDate as String
  double duration; // Duration of the activity in minutes
  List<String>? votes;
  List<String>? comments;

  Activity({
    this.activityId,
    required this.createdBy,
    required this.destinationId,
    required this.name,
    required this.startDate,
    required this.duration,
    required this.location,
    this.votes,
    this.comments,
  });

  // Factory method to create Activity from JSON
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      createdBy: json['createdBy'],
      activityId: json['activityId'],
      destinationId: json['destinationId'],
      name: json['name'],
      startDate: DateTime.parse(json['startDate']),
      duration: json['duration'].toDouble(),
      location: json['location'],
      votes: json['votes'] != null ? List<String>.from(json['votes']) : null,
      comments:
          json['comments'] != null ? List<String>.from(json['comments']) : null,
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
      'votes': votes,
      'comments': comments,
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
        '  votes: $votes,\n'
        '  comments: $comments\n'
        '}';
  }

  void update(Activity updatedActivity) {
    name = updatedActivity.name;
    startDate = updatedActivity.startDate;
    duration = updatedActivity.duration;
    location = updatedActivity.location;
    votes = updatedActivity.votes;
    comments = updatedActivity.comments;
  }
}
