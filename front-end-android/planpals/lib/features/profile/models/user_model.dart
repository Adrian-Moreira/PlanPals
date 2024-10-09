class User {
  final String id;
  final String userName;

  User({
    required this.id,
    required this.userName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    User user = User(
      id: '_id',
      userName: 'userName',
    );

    return user;
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userName': userName,
    };
  }
}
