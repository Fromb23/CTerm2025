import { baseApi } from "../baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "/courses/",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Courses", id })),
            { type: "Courses", id: "LIST" },
          ]
          : [{ type: "Courses", id: "LIST" }],
    }),

    getCourseById: builder.query({
      query: (courseId) => `/courses/${courseId}/`,
      providesTags: (result, error, courseId) => [
        { type: "Courses", id: courseId },
      ],
    }),

    getCourseById: builder.query({
      query: (courseId) => `/courses/${courseId}/`,
      providesTags: (result, error, courseId) => [
        { type: "Courses", id: courseId },
      ],
    }),

    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/courses/",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),

    updateCourse: builder.mutation({
      query: ({ courseId, updatedCourse }) => ({
        url: `/courses/${courseId}/`,
        method: "PUT",
        body: updatedCourse,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
