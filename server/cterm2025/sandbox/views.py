from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import subprocess
import os

class ValidateRepo(APIView):
    def post(self, request):
        task_name = request.data.get("task_name")
        repo_url = request.data.get("repo_url")

        if not task_name or not repo_url:
            return Response(
                {"error": "Task name and repo URL are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        checker_exec = os.path.join(os.getcwd(), 'sandbox', 'checker', 'checker')

        if not os.path.isfile(checker_exec):
            return Response(
                {"error": "Checker executable not found."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            result = subprocess.run(
                [checker_exec, "--task-name", task_name, "--repo", repo_url],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=os.path.join(os.getcwd(), 'sandbox'),
                timeout=30
            )
        except subprocess.TimeoutExpired:
            return Response({"error": "Checker timed out."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        stderr = result.stderr
        stdout = result.stdout
        return_code = result.returncode

        semantic_error = (
            "Validation failed" in stderr or
            "Missing" in stderr or
            "not found" in stderr
        )

        response = {
            "task_name": task_name,
            "repo_url": repo_url,
            "exit_code": 1 if semantic_error or return_code != 0 else 0,
            "stdout": stdout,
            "stderr": stderr
        }

        return Response(response, status=status.HTTP_200_OK)
