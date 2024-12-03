import 'package:flutter/material.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/shopping_list/models/shopping_list_model.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:planpals/features/shopping_list/views/shopping_list_details_view.dart';
import 'package:provider/provider.dart';

class CreateShoppingListForm extends StatefulWidget {
  const CreateShoppingListForm({super.key});

  @override
  State<CreateShoppingListForm> createState() => CreateShoppingListFormState();
}

class CreateShoppingListFormState extends State<CreateShoppingListForm> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for the form fields
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<ShoppingListViewModel>(context);
    final user = Provider.of<UserViewModel>(context).currentUser!;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Create Shopping List"),
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
                  labelText: 'Shopping List Name',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a shopping list name';
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

                      ShoppingList newShoppingList = ShoppingList(
                        name: _nameController.text,
                        description: _descriptionController.text,
                        id: '',
                        createdBy: user.id,
                        items: [],
                      );

                      newShoppingList =
                          await viewModel.addShoppingList(newShoppingList);

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

                        viewModel.currentShoppingList = newShoppingList;

                        Navigator.pushNamed(context, '/shoppingListDetails');
                      }
                    },
                    child: const Text('Create Shopping List'),
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
