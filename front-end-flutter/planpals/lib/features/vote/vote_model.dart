class Vote {
  String id;
  String objectId;
  final String type;
  final String createdBy;
  List<String> upVotes;
  List<String> downVotes;
  bool upVoted;
  bool downVoted;

  Vote(
      {required this.id,
      required this.objectId,
      required this.type,
      required this.createdBy,
      required this.upVotes,
      required this.downVotes,
      this.upVoted = false,
      this.downVoted = false});

  factory Vote.fromJson(Map<String, dynamic> json) {
    return Vote(
      id: json['_id'] ?? '',
      objectId: json['objectId']['id'] ?? '',
      type: json['objectId']['collection'] ?? '',
      createdBy: json['createdBy'] ?? '',
      upVotes: List<String>.from(json['upVotes']),
      downVotes: List<String>.from(json['downVotes']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'objectId': objectId,
      'type': type,
      'createdBy': createdBy,
      'upVotes': upVotes,
      'downVotes': downVotes
    };
  }

  @override
  String toString() {
    return 'Vote{id: $id,'
        'objectId: $objectId,'
        'type: $type,'
        'createdBy: $createdBy,'
        'upVotes: $upVotes,'
        'downVotes: $downVotes,' 
        'upVoted: $upVoted,'
        'downVoted: $downVoted}';
  }

  void updateFromJson(Map<String, dynamic> json) {
    id = json['_id'] ?? '';
    objectId = json['objectId']['id'] ?? '';
    upVotes = List<String>.from(json['upVotes']);
    downVotes = List<String>.from(json['downVotes']);

    upVoted = upVotes.contains(createdBy);
    downVoted = downVotes.contains(createdBy);
  }
}
