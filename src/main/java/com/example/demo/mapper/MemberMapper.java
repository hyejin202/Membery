package com.example.demo.mapper;

import java.util.*;

import org.apache.ibatis.annotations.*;

import com.example.demo.domain.*;

@Mapper
public interface MemberMapper {

	@Insert("""
			INSERT INTO Member (id, name, password, nickName, email, phoneNumber)
			VALUES (#{id}, #{name}, #{password}, #{nickName}, #{email}, #{phoneNumber})
			""")
	int insert(Member member);

	
	@Select("""
			SELECT *
			FROM Member
			ORDER BY inserted DESC
			""")
	List<Member> selectAll();


	@Select("""
			SELECT *
			FROM Member
			WHERE id = #{id}
			""")
	Member selectById(String id);


	@Delete("""
			DELETE FROM Member
			WHERE id = #{id}
			""")
	Integer deleteById(String id);


	@Update("""
			<script>
			
			UPDATE Member
			SET 
				<if test="password neq null and password neq ''">
				password = #{password},
				</if>
				
				nickName = #{nickName},
				email = #{email},
				phoneNumber = #{phoneNumber}
			WHERE 
				id = #{id}
				
			</script>
			""")
	Integer update(Member member);
	
}