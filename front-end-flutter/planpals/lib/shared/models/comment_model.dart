class Comment {
  final String id;
  final DateTime createdAt; // Changed to DateTime
  final String createdBy;
  final DateTime updatedAt; // Changed to DateTime
  final String title;
  final String content;

  Comment({
    required this.id,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.title,
    required this.content,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['_id'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String), // Convert String to DateTime
      createdBy: json['createdBy'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String), // Convert String to DateTime
      title: json['title'] as String,
      content: json['content'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'createdAt': createdAt.toIso8601String(), // Convert DateTime to String
      'createdBy': createdBy,
      'updatedAt': updatedAt.toIso8601String(), // Convert DateTime to String
      'title': title,
      'content': content,
    };
  }
}
