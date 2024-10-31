import 'dart:convert';
import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/shared/network/api_service.dart';

class VoteService {
  final ApiService _apiService = ApiService();

  /// Checks if the user has voted on a specific object.
  ///
  /// Sends a GET request to the server to verify if a user has voted on an
  /// object identified by the given `objectId` and `type`.
  ///
  /// Returns a map containing the vote data if successful.
  ///
  /// Throws an exception if the request fails.
  ///
  /// [userId] - The ID of the user.
  /// [objectId] - The ID of the object.
  /// [type] - The type of the object.
  Future<Map<String, dynamic>> checkUserVoted(String userId, String objectId, String type) async {
    try {
      final response = await _apiService.get('/vote/$userId?objectId=$objectId&type=$type');
      return jsonDecode(response.body)['data'];
    } catch (e) {
      throw Exception('Failed to check if user voted: $e');
    }
  }


  /// Fetches the vote data for a specific object.
  ///
  /// Sends a GET request to the server to retrieve vote information for an
  /// object identified by the given `objectId` and `type`.
  ///
  /// Returns a `Vote` object containing the vote data if successful.
  ///
  /// Throws an exception if the request fails.
  ///
  /// [objectId] - The ID of the object.
  /// [type] - The type of the object.
  Future<Vote> fetchVote(Vote vote) async {
    try {
      print('FETCHING VOTE: $vote');
      final response = await _apiService.get('/vote?objectId=${vote.objectId}&type=${vote.type}');
      vote.updateFromJson(jsonDecode(response.body)['data']);
      print('FETCHED VOTE: $vote');
      return vote;
    } catch (e) {
      throw Exception('Failed to fetch vote: $e');
    }
  }


  /// Upvotes an object in the planner with the given `vote` data.
  ///
  /// Sends a POST request to the server to upvote an object with the given
  /// `vote` data.
  ///
  /// Returns a `Vote` object containing the updated vote information if
  /// successful.
  ///
  /// Throws an exception if the request fails.
  ///
  /// [vote] - The vote data to upvote with.
  Future<Vote> upVote(Vote vote) async {
    try {
      print('VOTE SERVICE, UPVOTING: $vote');
      final response = await _apiService.post('/vote/up', vote.toJson());
      vote.updateFromJson(jsonDecode(response.body)['data']);
      print('VOTE SERVICE, UPVOTED: $vote');
      return vote;
    } catch (e) {
      throw Exception('Failed to upvote: $e');
    }
  }


  /// Downvotes an object in the planner with the given `vote` data.
  ///
  /// Sends a POST request to the server to downvote an object with the given
  /// `vote` data.
  ///
  /// Returns a `Vote` object containing the updated vote information if
  /// successful.
  ///
  /// Throws an exception if the request fails.
  ///
  /// [vote] - The vote data to downvote with.
  Future<Vote> downVote(Vote vote) async {
    try {
      final response = await _apiService.post('/vote/down', vote.toJson());
      vote.updateFromJson(jsonDecode(response.body)['data']);
      return vote;
    } catch (e) {
      throw Exception('Failed to downvote: $e');
    }
  }


  /// Deletes a vote for a specific user.
  ///
  /// Sends a DELETE request to the server to remove a vote associated with the
  /// given `vote` data and `userId`.
  ///
  /// Throws an exception if the request fails.
  ///
  /// [vote] - The vote data to delete.
  /// [userId] - The ID of the user whose vote is to be deleted.
  Future<Vote> removeVote(Vote vote) async {
    try {
      final response = await _apiService.deleteWithBody('/vote?userId=${vote.createdBy}', vote.toJson());
      vote.updateFromJson(jsonDecode(response.body)['data']);
      return vote;
    } catch (e) {
      throw Exception('Failed to delete vote: $e');
    }
  }

}