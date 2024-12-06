import 'package:planpals/shared/utils/date_utils.dart';

class TodoTask {
  final String id;
  final String createdBy;
  String todoListId;
  String name;
  String? assignedTo;
  DateTime dueDate; // Can be a string or a Date
  bool isCompleted;

  TodoTask({
    required this.id,
    required this.todoListId,
    required this.createdBy,
    required this.name,
    this.assignedTo = '',
    required this.dueDate,
    required this.isCompleted,
  });

  // From JSON to Dart Object
  factory TodoTask.fromJson(Map<String, dynamic> json) {
    return TodoTask(
      id: json['_id'] ?? '',
      todoListId: json['todoListId'] ?? '',
      createdBy: json['createdBy'] ?? '',
      name: json['name'] ?? '',
      assignedTo: json['assignedTo'] ?? '',
      dueDate: DateTime.parse(json['dueDate']),
      isCompleted: json['isCompleted'] ?? false,
    );
  }

  // From Dart Object to JSON
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'todoListId': todoListId,
      'createdBy': createdBy,
      'name': name,
      'assignedTo': assignedTo,
      'dueDate': DateTimeToIso.formatToUtcIso(dueDate),
      'isCompleted': isCompleted,
    };
  }

  void update(TodoTask updatedTodoTask) {
    name = updatedTodoTask.name;
    assignedTo = updatedTodoTask.assignedTo;
    dueDate = updatedTodoTask.dueDate;
    isCompleted = updatedTodoTask.isCompleted;
  }
}
