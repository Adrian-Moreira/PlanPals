
import 'package:flutter/material.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';

class TodoTaskCard extends StatelessWidget {
  final TodoTask todoTask;

  const TodoTaskCard({super.key, required this.todoTask});

  @override
  Widget build(BuildContext context) {
    return Card(
        child: ListTile(
      title: Text(todoTask.name),
    ));
  }
}