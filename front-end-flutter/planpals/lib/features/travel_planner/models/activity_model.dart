class Activity {
  final String? activityId;
  final String destinationId;
  String name;
  DateTime date; // Date as String
  double duration; // Duration of the activity in minutes
  List<String>? locations;
  List<String>? votes;
  List<String>? comments;

  Activity({
    this.activityId,
    required this.destinationId,
    required this.name,
    required this.date,
    required this.duration,
    this.locations,
    this.votes,
    this.comments,
  });

  // Factory method to create Activity from JSON
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      activityId: json['activityId'],
      destinationId: json['destinationId'],
      name: json['name'],
      date: DateTime.parse(json['date']),
      duration: json['duration'].toDouble(),
      locations: json['locations'] != null
          ? List<String>.from(json['locations'])
          : null,
      votes: json['votes'] != null ? List<String>.from(json['votes']) : null,
      comments:
          json['comments'] != null ? List<String>.from(json['comments']) : null,
    );
  }

  // Method to convert Activity to JSON
  Map<String, dynamic> toJson() {
    return {
      'activityId': activityId,
      'destinationId': destinationId,
      'name': name,
      'date': date.toIso8601String(),
      'duration': duration,
      'locations': locations,
      'votes': votes,
      'comments': comments,
    };
  }

  @override
  String toString() {
    return 'Activity {\n'
        '  activityId: $activityId,\n'
        '  destinationId: $destinationId,\n'
        '  name: $name,\n'
        '  date: $date,\n'
        '  duration: $duration,\n'
        '  locations: $locations,\n'
        '  votes: $votes,\n'
        '  comments: $comments\n'
        '}';
  }

  void update(Activity updatedActivity) {
    name = updatedActivity.name;
    date = updatedActivity.date;
    duration = updatedActivity.duration;
    locations = updatedActivity.locations;
    votes = updatedActivity.votes;
    comments = updatedActivity.comments;
  }
}
