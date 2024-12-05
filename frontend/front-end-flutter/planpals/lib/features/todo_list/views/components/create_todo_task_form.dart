import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

class CreateTodoTaskForm extends StatefulWidget {
  final TodoList todoList;

  const CreateTodoTaskForm({super.key, required this.todoList});

  @override
  State<CreateTodoTaskForm> createState() => _CreateTodoTaskFormState();
}

class _CreateTodoTaskFormState extends State<CreateTodoTaskForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  DateTime? _dueDate;

  @override
  Widget build(BuildContext context) {
    final TodoListViewModel todoListViewModel =
        Provider.of<TodoListViewModel>(context);
    final User user =
        Provider.of<UserViewModel>(context, listen: false).currentUser!;

    final TodoList todoList = widget.todoList;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Todo Task'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Task Name*'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20),

              DateTimeForm(
                initialDate: _dueDate,
                labelText: 'Due Date and Time *',
                placeholder: 'Select Due Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _dueDate = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 20), //margin

              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState?.validate() == true) {
                    TodoTask newTodoTask = TodoTask(
                      id: '',
                      createdBy: user.id,
                      name: _nameController.text,
                      todoListId: todoList.id,
                      dueDate: _dueDate!,
                      isCompleted: false,
                      assignedTo: user.id,
                    );

                    newTodoTask =
                        await todoListViewModel.addTodoTask(newTodoTask);

                    // Display success / failure message
                    if (todoListViewModel.errorMessage != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                            content: Text(todoListViewModel.errorMessage!)),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Task added successfully!')),
                      );
                    }

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add Task'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
