import 'package:flutter/material.dart';
import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/features/vote/vote_service.dart';

class VoteViewModel extends ChangeNotifier {
  final VoteService _voteService = VoteService();

  late Vote _vote;
  Vote get vote => _vote;

  Future<Vote> fetchVote(Vote vote) async {
    try {
      _vote = vote;
      return await _voteService.fetchVote(vote);
    } catch (e) {
      throw Exception('Failed to fetch vote: $e');
    }
  }

  Future<Vote> upVote(Vote vote) async {
    try {
      return await _voteService.upVote(vote);
    } catch (e) {
      throw Exception('Failed to upvote: $e');
    }
  }

  Future<Vote> downVote(Vote vote) async {
    try {
      return await _voteService.downVote(vote);
    } catch (e) {
      throw Exception('Failed to downvote: $e');
    }
  }

  Future<Vote> removeVote(Vote vote) async {
    try {
      return await _voteService.removeVote(vote);
    } catch (e) {
      throw Exception('Failed to remove vote: $e');
    }
  }

  void dispose() {
    super.dispose();
  }
}
