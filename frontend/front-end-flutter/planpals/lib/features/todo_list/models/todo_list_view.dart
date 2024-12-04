
import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/todo_list_service.dart';
import 'package:provider/provider.dart';

class AddTodoList extends StatelessWidget {
  const AddTodoList({super.key});

  @override
  Widget build(BuildContext context) {
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
    TodoListService todoService = TodoListService();

    
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          ElevatedButton(
            onPressed: () {
                todoService.addTodoList(TodoList(
                  id: "",
                  name: "New Todo List!!!!!!!!!!",
                  description: "This is a new todo list",
                  tasks: [],
                  roUsers: [],
                  rwUsers: [], 
                  createdBy: user.id
                ));
            }, 
            child: const Text("Add Todo List",)),

          ElevatedButton(onPressed: () {
              todoService.fetchTodoListsByUserId(user.id);
          }, child: Text("Fetch Todo Lists"))
        ],
      )
    );
  }
}