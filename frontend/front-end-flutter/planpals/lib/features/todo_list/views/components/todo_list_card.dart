
import 'package:flutter/material.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/views/todo_list_details_view.dart';

class TodoListCard extends StatelessWidget {
  final TodoList todoList;

  const TodoListCard({super.key, required this.todoList});

  @override
  Widget build(BuildContext context) {
    return Card(
        child: ListTile(
      title: Text(todoList.name),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => TodoListDetailsView(todoList: todoList),
          ),
        );
      },
    ));
  }
}