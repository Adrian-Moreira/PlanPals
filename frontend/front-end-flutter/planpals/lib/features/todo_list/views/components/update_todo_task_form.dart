import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

class UpdateTodoTaskForm extends StatefulWidget {
  final TodoTask todoTask;

  const UpdateTodoTaskForm({super.key, required this.todoTask});

  @override
  State<UpdateTodoTaskForm> createState() => _UpdateTodoTaskFormState();
}

class _UpdateTodoTaskFormState extends State<UpdateTodoTaskForm> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  DateTime? _dueDate;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.todoTask.name);
    _dueDate = widget.todoTask.dueDate;
  }

  @override
  Widget build(BuildContext context) {
    final TodoListViewModel todoListViewModel =
        Provider.of<TodoListViewModel>(context);
    final User user =
        Provider.of<UserViewModel>(context, listen: false).currentUser!;
    final TodoTask todoTask = widget.todoTask;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Update Todo Task'),
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

                    // Update the task
                    TodoTask updatedTodoTask = TodoTask(
                      id: todoTask.id,
                      createdBy: todoTask.createdBy,
                      name: _nameController.text,
                      todoListId: todoTask.todoListId,
                      dueDate: _dueDate!,
                      isCompleted: todoTask.isCompleted,
                      assignedTo: todoTask.assignedTo,
                    );

                    todoListViewModel.updateTodoTask(updatedTodoTask, user.id);

                    // Display success / failure message
                    if (todoListViewModel.errorMessage != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                            content: Text(todoListViewModel.errorMessage!)),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Task updated successfully!')),
                      );
                    }

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Save Task'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
