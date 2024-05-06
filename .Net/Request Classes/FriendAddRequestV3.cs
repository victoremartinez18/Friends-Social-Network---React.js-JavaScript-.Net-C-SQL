using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Friends
{
    public class FriendAddRequestV3
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Bio { get; set; }
        [Required]
        public string Summary { get; set; }
        [Required]
        public string Headline { get; set; }
        [Required]
        public string Slug { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int StatusId { get; set; }
        [Required]
        public int ImageTypeId { get; set; }
        [Required]
        public string primaryImage { get; set; }
        public List<SkillAddRequest> Skills { get; set; }

    }
}
