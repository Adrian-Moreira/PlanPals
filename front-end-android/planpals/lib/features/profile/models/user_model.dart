class User {
  final String id;
  final String userName;
  final String preferredName;

  User({
    required this.id,
    required this.userName,
    required this.preferredName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] as String,
      userName: json['userName'] as String,
      preferredName: json['preferredName'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userName': userName,
      'preferredName': preferredName,
    };
  }
}
