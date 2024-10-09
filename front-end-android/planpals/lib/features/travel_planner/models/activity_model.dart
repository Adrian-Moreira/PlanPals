class Activity {
  final String? activityId;
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
  });

  // Factory method to create Activity from JSON
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      activityId: json['activityId'],
      destinationId: json['destinationId'],
      name: json['name'],
      date: json['date'],
      time: json['time'],
      locations: List<String>.from(json['locations'] ?? []),
      votes: List<String>.from(json['votes'] ?? []),
      comments: List<String>.from(json['comments'] ?? []),
    );
  }

  // Method to convert Activity to JSON
  Map<String, dynamic> toJson() {
    return {
      'activityId': activityId,
      'destinationId': destinationId,
      'name': name,
      'date': date,
      'time': time,
      'locations': locations,
      'votes': votes,
      'comments': comments,
    };
  }

  Map<String, dynamic> addToJson() {
    return {
      'name': name,
      'date': date,
      'time': time,
    };
  }
}
