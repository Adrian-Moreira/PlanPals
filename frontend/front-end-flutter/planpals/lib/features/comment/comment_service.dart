import 'dart:convert';

import 'package:planpals/features/comment/comment_model.dart';
import 'package:planpals/shared/network/api_service.dart';

class CommentService {
  final ApiService _apiService = ApiService();

  Future<List<Comment>> fetchComments(String objectId, String type) async {
    try {
      final response = await _apiService.get('/comment?objectId=$objectId&type=$type');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];

      print('COMMENTS RESPONSE BODY: $jsonList');

      return jsonList.map((json) => Comment.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch comments: $e');
    }
  }

  Future<Comment> addComment(Comment comment) async {
    try {
      print(comment.toJson());
      final response = await _apiService.post('/comment', comment.toJson());
      final responseBody = jsonDecode(response.body);
      Comment newComment = Comment.fromJson(responseBody['data']);
      return newComment;
    } catch (e) {
      throw Exception('Failed to create the comment: $e');
    }
  }

  Future<void> deleteComment(Comment comment) async {
    try {
      print(comment.toJson());
      print('/comment/${comment.id}?userId=${comment.createdBy}');
      await _apiService.deleteWithBody('/comment/${comment.id}?userId=${comment.createdBy}', comment.toJson());
    } catch (e) {
      throw Exception('Failed to delete the comment: $e');
    }
  }
}