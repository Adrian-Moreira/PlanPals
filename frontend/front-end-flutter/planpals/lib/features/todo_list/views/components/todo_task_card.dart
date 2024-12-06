import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/features/todo_list/views/components/update_todo_task_form.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:provider/provider.dart';

class TodoTaskCard extends StatefulWidget {
  final TodoTask todoTask;
  final VoidCallback? onComplete;

  const TodoTaskCard({
    super.key,
    required this.todoTask,
    this.onComplete,
  });

  @override
  State<TodoTaskCard> createState() => _TodoTaskCardState();
}

class _TodoTaskCardState extends State<TodoTaskCard> {
  late TodoListViewModel _todoListViewModel;
  late User user;
  late TodoTask todoTask;

  Future<void> _handleOnEdit() async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UpdateTodoTaskForm(todoTask: todoTask),
      ),
    );
  }

  Future<void> _handleOnDelete() async {
    _todoListViewModel.deleteTodoTask(todoTask, user.id);
  }

  Future<void> _handleOnComplete() async {
    todoTask.isCompleted = !todoTask.isCompleted;
    _todoListViewModel.updateTodoTask(todoTask, user.id);
  }

  @override
  void initState() {
    super.initState();
    user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
    _todoListViewModel = Provider.of<TodoListViewModel>(context, listen: false);
    todoTask = widget.todoTask;
  }

  @override
  Widget build(BuildContext context) {
    String name = widget.todoTask.name;
    DateTime dueDate = widget.todoTask.dueDate;
    bool isCompleted = widget.todoTask.isCompleted;

    _todoListViewModel = Provider.of<TodoListViewModel>(context, listen: false);

    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                // Task Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Task Name
                      Text(
                        name,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      const SizedBox(height: 8),
          
                      // Due Date
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                          const SizedBox(width: 8),
                          Text(
                            'Due: ${DateTimeFormat.formatDateTime(dueDate)}',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
          
                      const SizedBox(height: 8),
          
                      // Completion Status
                      Row(
                        children: [
                          Icon(
                            isCompleted ? Icons.check_circle : Icons.circle_outlined,
                            color: isCompleted ? Colors.green : Colors.red,
                            size: 16,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            isCompleted ? 'Completed' : 'Not Completed',
                            style: TextStyle(
                              color: isCompleted ? Colors.green : Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
          
                // Mark as Completed Button
                if (!isCompleted)
                  IconButton(
                    icon: const Icon(Icons.done, color: Colors.blue),
                    tooltip: 'Mark as Completed',
                    onPressed: _handleOnComplete,
                  ),
              ],
            ),
          ),

          // Dropdown Button
          _buildDropdownButton(),
        ],
      ),
    );
  }

  Widget _buildDropdownButton() {
    return Positioned(
      right: 0,
      top: 0,
      child: PopupMenuButton<String>(
        icon: const Icon(Icons.more_vert),
        onSelected: (String result) {
          if (result == 'Edit') {
            _handleOnEdit();
          } else if (result == 'Delete') {
            _handleOnDelete();
          }
        },
        itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
          const PopupMenuItem<String>(
            value: 'Edit',
            child: Row(
              children: [
                Icon(Icons.edit),
                SizedBox(width: 10),
                Text('Edit'),
              ],
            ),
          ),
          const PopupMenuItem<String>(
            value: 'Delete',
            child: Row(
              children: [
                Icon(Icons.delete),
                SizedBox(width: 10),
                Text('Delete'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
