

import 'package:flutter/material.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/shopping_list/models/shopping_item_model.dart';
import 'package:planpals/features/shopping_list/models/shopping_list_model.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:provider/provider.dart';

class CreateShoppingItemForm extends StatefulWidget {
  final ShoppingList shoppingList;

  const CreateShoppingItemForm({super.key, required this.shoppingList});

  @override
  State<CreateShoppingItemForm> createState() => _CreateShoppingItemFormState();
}

class _CreateShoppingItemFormState extends State<CreateShoppingItemForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<ShoppingListViewModel>(context);
    final user = Provider.of<UserViewModel>(context).currentUser!;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Create Shopping Item"),
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
                  labelText: 'Item Name',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an item name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), // Margin

              // Location field
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a location';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), // Margin

              // Submit button
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

                      ShoppingItem newItem = ShoppingItem(
                        name: _nameController.text,
                        location: _locationController.text,
                        addedBy: user.id,
                      );

                      await viewModel.addShoppingItemToShoppingList(widget.shoppingList.id, newItem);

                      if (viewModel.errorMessage != null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(viewModel.errorMessage!)),
                        );
                        Navigator.pop(context);
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Added new item successfully!'),
                          ),
                        );
                        
                        Navigator.pop(context);
                      }
                    },
                    child: const Text('Add new item'),
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