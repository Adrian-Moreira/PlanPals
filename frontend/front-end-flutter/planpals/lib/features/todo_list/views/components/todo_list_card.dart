
import 'package:flutter/material.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';

class TodoListCard extends StatelessWidget {
  final TodoList todoList;

  const TodoListCard({super.key, required this.todoList});

  @override
  Widget build(BuildContext context) {
    return Card(
        child: ListTile(
      title: Text(todoList.name),
      onTap: () {
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //       builder: (context) => PlannerDetailsView(
        //             travelPlanner: travelPlanner,
        //           )), // navigate to travel planners
        // );
      },
    ));
  }
}