import 'package:flutter/material.dart';
import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/features/vote/vote_service.dart';

class VoteViewModel extends ChangeNotifier {
  final VoteService _voteService = VoteService();

  late Vote _vote;
  bool _isLoading = false;
  String? _errorMessage;

  Vote get vote => _vote;
  bool get isloading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<Vote> fetchVote(Vote vote) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _vote = vote;
      return await _voteService.fetchVote(vote);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return vote;
  }

  Future<Vote> upVote(Vote vote) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      return await _voteService.upVote(vote);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return vote;
  }

  Future<Vote> downVote(Vote vote) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      return await _voteService.downVote(vote);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return vote;
  }

  Future<Vote> removeVote(Vote vote) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      return await _voteService.removeVote(vote);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return vote;
  }

  @override
  void dispose() {
    super.dispose();
  }
}
