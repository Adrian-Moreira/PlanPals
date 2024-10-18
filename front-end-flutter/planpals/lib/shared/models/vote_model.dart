class Vote {
  final String id;
  final DateTime createdAt; // Changed to DateTime
  final String createdBy;
  final DateTime updatedAt; // Changed to DateTime
  final DateTime startDate; // Changed to DateTime
  final DateTime endDate; // Changed to DateTime

  Vote({
    required this.id,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.startDate,
    required this.endDate,
  });

  factory Vote.fromJson(Map<String, dynamic> json) {
    return Vote(
      id: json['_id'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String), // Convert String to DateTime
      createdBy: json['createdBy'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String), // Convert String to DateTime
      startDate: DateTime.parse(json['startDate'] as String), // Convert String to DateTime
      endDate: DateTime.parse(json['endDate'] as String), // Convert String to DateTime
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'createdAt': createdAt.toIso8601String(), // Convert DateTime to String
      'createdBy': createdBy,
      'updatedAt': updatedAt.toIso8601String(), // Convert DateTime to String
      'startDate': startDate.toIso8601String(), // Convert DateTime to String
      'endDate': endDate.toIso8601String(), // Convert DateTime to String
    };
  }
}
