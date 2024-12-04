import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/features/todo_list/views/todo_list_details_view.dart';
import 'package:provider/provider.dart';

class CreateTodoListForm extends StatefulWidget {
  const CreateTodoListForm({super.key});

  @override
  State<CreateTodoListForm> createState() => _CreateTodoListFormState();
}

class _CreateTodoListFormState extends State<CreateTodoListForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<TodoListViewModel>(context);
    final User user = Provider.of<UserViewModel>(context).currentUser!;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Create Todo List"),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Name field
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Todo List Name',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a todo list name';
                  }
                  return null;
                },
              ),

              const SizedBox(
                height: 20,
              ), //margin

              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Description',
                ),
              ),

              const SizedBox(
                height: 20,
              ),

              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: Center(
                  child: ElevatedButton(
                    onPressed: () async {
                      // Validate and save the form
                      if (_formKey.currentState?.validate() != true) {
                        // Validate custom date logic
                        return;
                      }

                      // Set description if empty
                      _descriptionController.text =
                          _descriptionController.text == ''
                              ? "No Description"
                              : _descriptionController.text;

                      TodoList newTodoList = TodoList(
                        name: _nameController.text,
                        description: _descriptionController.text,
                        id: '',
                        createdBy: user.id,
                        tasks: [],
                        roUsers: [],
                        rwUsers: [],
                      );

                      newTodoList = await viewModel.addTodoList(newTodoList);

                      if (viewModel.errorMessage != null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(viewModel.errorMessage!)),
                        );
                        Navigator.pop(context);
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content:
                                Text('Shopping List created successfully!'),
                          ),
                        );

                        Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (context) => TodoListDetailsView(
                                      todoList: newTodoList,
                                    )));
                      }
                    },
                    child: const Text('Create Todo List'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
