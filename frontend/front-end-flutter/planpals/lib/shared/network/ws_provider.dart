import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:planpals/shared/network/ws_service.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketProvider extends ChangeNotifier {
  WebSocketChannel? _channel;
  String? _error;
  final Map<String, WebSocketMessage> _messages = {};
  final Set<String> _subscriptions = {};
  final String wsURL = 'ws://localhost:8080';

  WebSocketProvider() {
    _connect();
  }

  String? get error => _error;
  Map<String, WebSocketMessage> get messages => _messages;
  Set<String> get subscriptions => _subscriptions;

  void _connect() {
    _channel = WebSocketChannel.connect(Uri.parse(wsURL));

    _channel!.stream.listen(
      _onMessage,
      onDone: _onDone,
      onError: _onError,
    );

    _error = null;
    notifyListeners();
  }

  void _onMessage(dynamic message) {
    final data = jsonDecode(message);
    final wsMessage = WebSocketMessage.fromJson(data);

    final key =
        '${wsMessage.action}:${wsMessage.message.type}:${wsMessage.message.data['_id']}';

    _messages[key] = wsMessage;
    notifyListeners();
  }

  void _onDone() {
    _error = 'Disconnected';
    notifyListeners();
    _attemptReconnect();
  }

  void _onError(error) {
    _error = 'Error: $error';
    notifyListeners();
    _attemptReconnect();
  }

  void _attemptReconnect() {
    Future.delayed(const Duration(seconds: 3), () {
      if (_channel == null || _channel!.closeCode != null) {
        _connect();
        _resubscribe();
      }
    });
  }

  void subscribe(List<MessageTopic> topics) {
    if (_channel == null) return;
    final newTopics =
        topics.where((t) => !_subscriptions.contains(t.toStr())).toList();
    newTopics.forEach((t) => _subscriptions.add(t.toStr()));
    if (newTopics.isEmpty) return;

    final msg = SubscriptionMessage(action: 'subscribe', topics: newTopics);
    _channel!.sink.add(jsonEncode(msg.toJson()));
  }

  void unsubscribe(List<MessageTopic> topics) {
    if (_channel == null) return;
    topics.forEach((t) => _subscriptions.remove(t.toStr()));

    final msg = SubscriptionMessage(action: 'unsubscribe', topics: topics);
    _channel!.sink.add(jsonEncode(msg.toJson()));
  }

  void _resubscribe() {
    final topics = _subscriptions.map((str) {
      final parts = str.split(':');
      final id = parts[0];
      final typeStr = parts[1];
      final type = TopicType.values.firstWhere((e) => e.name == typeStr);
      return MessageTopic(id: id, type: type);
    }).toList();

    if (topics.isNotEmpty) {
      final msg = SubscriptionMessage(action: 'subscribe', topics: topics);
      _channel!.sink.add(jsonEncode(msg.toJson()));
    }
  }

  void disconnect() {
    _channel?.sink.close();
    _channel = null;
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}
