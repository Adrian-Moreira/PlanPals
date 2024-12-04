
import 'dart:convert';

import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/shared/network/api_service.dart';

class TodoListService {
  final ApiService _apiService = ApiService();

  Future<List<TodoList>> fetchAllTodoLists() async {
    try {
      final response = await _apiService.get('/todolist');
      final List<dynamic> jsonList = jsonDecode(response.body);
      // Convert the JSON list into a List<TodoList>
      return jsonList.map((json) => TodoList.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch todo list");
    }
  }

  Future<List<TodoList>> fetchTodoListsByUserId(String userId) async {
    try {
      final response = await _apiService.get('/todolist?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      print("TODOLIST SERVICE FETCHING BY USERID: $jsonList");
      return jsonList.map((json) => TodoList.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch todo lists by userID=$userId: $e");
    }
  }


  Future<List<TodoTask>> fetchTodoTasksByTodoListId(String todoListId, String userId) async {
    try {
      final response = await _apiService.get('/todolist/$todoListId/task?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => TodoTask.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch todo tasks by todo list ID=$todoListId: $e");
    }
  }

  Future<TodoList> addTodoList(TodoList todoList) async {
    try {
      final response = await _apiService.post('/todolist', todoList.toJson());
      print("TODOLIST SERVICE: ${response.body}");
      return TodoList.fromJson(jsonDecode(response.body)['data'][0]);
    } catch (e) {
      throw Exception("Failed to create todo list: $e");
    }
  }

  Future<TodoTask> addTodoTask(TodoTask todoTask) async {
    try {
      final response = await _apiService.post('/todolist/${todoTask.todoListId}/task', todoTask.toJson());
      return TodoTask.fromJson(jsonDecode(response.body)['data'][0]);
    } catch (e) {
      throw Exception("Failed to create todo task: $e");
    }
  }

  Future<void> updateTodoTask(TodoTask todoTask, String userId) async {
  }

  Future<void> deleteTodoTask(TodoTask todoTask, String userId) async {
  }
}