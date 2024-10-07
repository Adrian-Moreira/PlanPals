class User {
  final String userId;            // Unique identifier for the user
  final String username;          // Name of the user
  final String? profilePicture; // URL to the user's profile picture (optional)

  User({
    required this.userId,
    required this.username,
    this.profilePicture,
  });

  // Convert a User instance to a Map (for sending to an API)
  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'username': username,
      'profilePicture': profilePicture,
    };
  }

  // Create a User instance from a Map (for receiving from an API)
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'] as String,
      username: json['username'] as String,
      profilePicture: json['profilePicture'] as String?,
    );
  }

}
