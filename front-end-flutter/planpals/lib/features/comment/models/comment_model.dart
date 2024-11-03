class Comment {
  String createdBy;
  String content;
  String objectId;
  String type;
  String userName;

  Comment(
      {required this.createdBy,
      required this.content,
      required this.objectId,
      required this.type,
      this.userName = ''});

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
        createdBy: json['createdBy'] ?? '',
        content: json['content'] ?? '',
        objectId: json['objectId'] ?? '',
        type: json['type'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {
      'createdBy': createdBy,
      'content': content,
      'objectId': objectId,
      'type': type
    };
  }
  
  bool isCreatedBy(String userId) {
    return createdBy == userId;
  }

  @override
  String toString() {
    return 'Comment(createdBy: $createdBy, content: $content, objectId: $objectId, type: $type)';
  }
}
