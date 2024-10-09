class User {
  final String id;
  final String userName;
  final DateTime? createdAt; // Changed to DateTime
  final DateTime? updatedAt; // Changed to DateTime

  User({
    required this.id,
    required this.userName,
     this.createdAt,
     this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] as String,
      userName: json['userName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String), // Convert String to DateTime
      updatedAt: DateTime.parse(json['updatedAt'] as String), // Convert String to DateTime
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userName': userName,
      'createdAt': createdAt?.toIso8601String(), // Convert DateTime to String
      'updatedAt': updatedAt?.toIso8601String(), // Convert DateTime to String
    };
  }
}
