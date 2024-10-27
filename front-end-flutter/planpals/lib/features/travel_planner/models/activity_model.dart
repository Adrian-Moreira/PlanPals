class Activity {
  final String? activityId;
<<<<<<< HEAD
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
=======
  final String? destinationId;
  final String name;
  final String date; // Date as String
  final String time; // Time as String
  final List<String>? locations;
  final List<String>? votes;
  final List<String>? comments;

  Activity({
     this.activityId,
     this.destinationId,
    required this.name,
    required this.date,
    required this.time,
     this.locations,
     this.votes,
     this.comments,
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
  });

  // Factory method to create Activity from JSON
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      activityId: json['activityId'],
      destinationId: json['destinationId'],
      name: json['name'],
<<<<<<< HEAD
      date: DateTime.parse(json['date']),
      duration: json['duration'].toDouble(),
      locations: json['locations'] != null
          ? List<String>.from(json['locations'])
          : null,
      votes: json['votes'] != null ? List<String>.from(json['votes']) : null,
      comments:
          json['comments'] != null ? List<String>.from(json['comments']) : null,
=======
      date: json['date'],
      time: json['time'],
      locations: List<String>.from(json['locations'] ?? []),
      votes: List<String>.from(json['votes'] ?? []),
      comments: List<String>.from(json['comments'] ?? []),
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
    );
  }

  // Method to convert Activity to JSON
  Map<String, dynamic> toJson() {
    return {
      'activityId': activityId,
      'destinationId': destinationId,
      'name': name,
<<<<<<< HEAD
      'date': date.toIso8601String(),
      'duration': duration,
=======
      'date': date,
      'time': time,
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
      'locations': locations,
      'votes': votes,
      'comments': comments,
    };
  }

<<<<<<< HEAD
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
=======
  Map<String, dynamic> addToJson() {
    return {
      'name': name,
      'date': date,
      'time': time,
    };
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
  }
}
