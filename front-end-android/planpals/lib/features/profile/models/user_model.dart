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
    User user = User(
      id: json['_id'],
      userName: json['userName'],
      preferredName: json['preferredName'],
    );
    print(user);
    return user;
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userName': userName,
      'preferredName': preferredName,
    };
  }

  @override
  String toString() {
    return 'User{id: $id, userName: $userName, preferredName: $preferredName}';
  }
}
