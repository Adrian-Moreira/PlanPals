class Vote {
  final String objectId;
  final String type;
  final List<String> upVotes;
  final List<String> downVotes;

  Vote(
      {required this.objectId,
      required this.type,
      required this.upVotes,
      required this.downVotes});

  factory Vote.fromJson(Map<String, dynamic> json) {
    return Vote(
      objectId: json['objectId'],
      type: json['type'],
      upVotes: List<String>.from(json['upVotes']),
      downVotes: List<String>.from(json['downVotes']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'objectId': objectId,
      'type': type,
      'upVotes': upVotes,
      'downVotes': downVotes
    };
  }

  @override
  String toString() {
    return 'Vote{objectId: $objectId,'
        'type: $type,'
        'upVotes: $upVotes,'
        'downVotes: $downVotes}';
  }
}
