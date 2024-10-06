class Activity {
  final String activityId;
  final String activityName;
  final DateTime startDate;
  final DateTime endDate;
  final String travelPlanId;

  Activity({
    required this.activityId,
    required this.activityName,
    required this.startDate,
    required this.endDate,
    required this.travelPlanId,
  });

  // Convert a Activity object into a Map.
  Map<String, dynamic> toJson() {
    return {
      'activityId': activityId,
      'activityName': activityName,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'travelPlanId': travelPlanId,
    };
  }

  // Create a Activity object from a Map.
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      activityId: json['activityId'],
      activityName: json['activityName'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      travelPlanId: json['travelPlanId'],
    );
  }
}
