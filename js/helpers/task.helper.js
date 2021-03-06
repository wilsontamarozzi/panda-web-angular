( function() {
	'use strict';

	angular
		.module('appWeb')
		.factory('TaskHelper', Service);

	function Service($filter) {

		/* Agrupa os historicos por data para montar a timeline na view */
		function _buildTimelineComments(comments) {			
			if(typeof comments !== 'undefined' && comments !== null) {
				var currentDate;
				/* Ordena os comentário do mais recente para o mais antigo */
				comments.sort(function (a, b) {
					return new Date(b.registered_at) - new Date(a.registered_at);
				});
				/* Seta quais data serão nós para exibir as datas */
				angular.forEach(comments, function (comment) {
					/* Convert a data String em data removendo horario */
					var _date = $filter('date')(new Date(comment.registered_at), 'dd/MM/yyyy');
					/* Compara se a data atual é diferente da ultima data */
					if(currentDate !== _date) {
						currentDate = _date;
						comment.showDate = true;
					} else {
						comment.showDate = false;	
					}
				});
			}
			
			return comments;
		}

		/* Salva o comentário na timeline */
		function _buildComment(text, personName) {
			var comment = {};

			if(text && personName) {
				comment = {
					commentTemp : true,
					comment : text,
					registered_at : new Date(),
					person : {
						name : personName
					}
				};
			}

			return comment;
		}

		/* Conta a quantidade tarefas não visualizadas */
		function _tasksNotVisualizedCount(tasks) {
			var count = 0;
			angular.forEach(tasks, function (task) {
				if(task.visualized === false)
					count++;
			});
			return count;
		}

		/* Verifica a situação da tarefa */
		function _checkTaskStatus(tasks) {
			var today = new Date();
			angular.forEach(tasks, function (task) {
				var date = new Date(task.due);

				switch(true) {
					case (task.completed_at !== null && typeof task.completed_at !== 'undefined'):
						task.situationTag = 'green';
					break;
					case(date == today):
						task.situationTag = 'yellow';
					break;
					case(date < today):
						task.situationTag = 'red';
					break;
					case(date > today):
						task.situationTag = 'blue';
					break;
				}
			});
		}

		return {
			buildTimelineComments : _buildTimelineComments,
			buildComment : _buildComment,
			tasksNotVisualizedCount : _tasksNotVisualizedCount,
			checkTaskStatus : _checkTaskStatus
		};	
	}
})();