enum TopicType { planners, planner, inbox }

class MessageTopic {
  final TopicType type;
  final String id;

  MessageTopic({required this.type, required this.id});

  String toStr() => '$id:${type.name}';
}

class PPObject {
  final dynamic data;
  final String type;
  final List<String>? userIds;
  final String? plannerId;
  final List<dynamic>? addon;

  PPObject({
    required this.data,
    required this.type,
    this.userIds,
    this.plannerId,
    this.addon,
  });

  factory PPObject.fromJson(Map<String, dynamic> json) {
    return PPObject(
      data: json['data'],
      type: json['type'],
      userIds:
          json['userIds'] != null ? List<String>.from(json['userIds']) : null,
      plannerId: json['plannerId'],
      addon: json['addon'],
    );
  }
}

class WebSocketMessage {
  final MessageTopic topic;
  final String action; // 'update' or 'delete'
  final PPObject message;

  WebSocketMessage({
    required this.topic,
    required this.action,
    required this.message,
  });

  factory WebSocketMessage.fromJson(Map<String, dynamic> json) {
    return WebSocketMessage(
      topic: MessageTopic(
        type:
            TopicType.values.firstWhere((e) => e.name == json['topic']['type']),
        id: json['topic']['id'],
      ),
      action: json['action'],
      message: PPObject.fromJson(json['message']),
    );
  }
}

class SubscriptionMessage {
  final String action; // 'subscribe' or 'unsubscribe'
  final List<MessageTopic> topics;

  SubscriptionMessage({required this.action, required this.topics});

  Map<String, dynamic> toJson() => {
        'action': action,
        'topics': topics.map((t) => {'type': t.type.name, 'id': t.id}).toList(),
      };
}
