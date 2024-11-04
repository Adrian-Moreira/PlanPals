class Comment {
  final String id;
  final String createdBy;
  final String content;
  String objectId;
  String type;
  String userName;

  Comment(
      {required this.createdBy,
      required this.content,
      required this.objectId,
      required this.type,
      required this.id,
      this.userName = ''});

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
        id: json['_id'] ?? '',
        createdBy: json['createdBy'] ?? '',
        content: json['content'] ?? '',
        objectId: json['objectId'] ?? '',
        type: json['type'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
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
    return 'Comment(id: $id, createdBy: $createdBy, content: $content, objectId: $objectId, type: $type)';
  }
}
